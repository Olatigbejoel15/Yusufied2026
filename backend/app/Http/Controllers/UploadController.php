<?php

namespace App\Http\Controllers;

use App\Models\Upload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    // GET /api/uploads: returns the gallery, newest first
    public function index(): JsonResponse
    {
        return response()->json(
            Upload::latest()->paginate(30) // 30 per page keeps the gallery fast
        );
    }

    // POST /api/uploads: saves one or more files from a guest
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'guest_name' => 'nullable|string|max:100', // Name is optional
            'files' => 'required|array|max:50', // At least one file, 50 at most
            'files.*' => 'file|mimes:jpg,jpeg,png,webp,mp4,mov|max:204800', // Each file max 200 MB (KB)
        ]);

        $saved = []; // Collects the records we create

        foreach ($request->file('files') as $file) {
            $path = $file->store('uploads', 'public'); // Save to storage/app/public/uploads

            $type = str_starts_with($file->getMimeType(), 'video') ? 'video' : 'image'; // Detect type from MIME

            $saved[] = Upload::create([
                'guest_name' => $request->guest_name, // Same name for every file in this request
                'path' => $path, // Where the file was stored
                'type' => $type, // "image" or "video"
                'original_name' => $file->getClientOriginalName(), // Name from the guest's phone
                'size' => $file->getSize(), // Size in bytes
            ]);
        }

        return response()->json($saved, 201); // 201 means "created"
    }
}
