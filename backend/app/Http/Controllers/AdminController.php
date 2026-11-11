<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Upload;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    // POST /api/admin/login: returns a token when the email and password are right
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => 'required|email', // Admin email
            'password' => 'required|string', // Admin password
        ]);

        $user = User::where('email', $data['email'])->first(); // Find the admin

        if (! $user || ! Hash::check($data['password'], $user->password)) { // Wrong email or password
            return response()->json(['message' => 'Wrong email or password.'], 401); // Same message for both, so nothing leaks
        }

        $token = $user->createToken('admin')->plainTextToken; // New login token

        return response()->json(['token' => $token]); // The website saves this
    }

    // POST /api/admin/logout: deletes the token that was used
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete(); // The token stops working
        return response()->json(['ok' => true]);
    }

    // DELETE /api/admin/uploads/{upload}: removes the file and its record
    public function destroyUpload(Upload $upload): JsonResponse
    {
        Storage::disk('public')->delete($upload->path); // Delete the file from storage
        $upload->delete(); // Delete the database row
        return response()->json(['ok' => true]);
    }

    // DELETE /api/admin/messages/{message}: removes a message
    public function destroyMessage(Message $message): JsonResponse
    {
        $message->delete(); // Delete the database row
        return response()->json(['ok' => true]);
    }
}
