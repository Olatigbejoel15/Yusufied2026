<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Anyone can view
Route::get('/uploads', [UploadController::class, 'index']); // Gallery list
Route::get('/messages', [MessageController::class, 'index']); // Message wall list

// Adding anything needs the access code
Route::middleware('access.code')->group(function () {
    Route::get('/access/check', fn () => response()->json(['ok' => true])); // Lets the website test a code
    Route::post('/uploads', [UploadController::class, 'store']); // Receive uploads
    Route::post('/messages', [MessageController::class, 'store'])->middleware('throttle:60,1'); // Max 60 per minute per IP
});
