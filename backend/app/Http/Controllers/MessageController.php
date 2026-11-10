<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // GET /api/messages: returns messages, newest first
    public function index(): JsonResponse
    {
        return response()->json(
            Message::latest()->paginate(30) // 30 per page
        );
    }

    // POST /api/messages: saves one message
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'guest_name' => 'required|string|max:100', // Name is required
            'body' => 'required|string|max:1000', // Message up to 1000 characters
        ]);

        $message = Message::create($data); // Save only the validated fields

        return response()->json($message, 201); // 201 means "created"
    }
}
