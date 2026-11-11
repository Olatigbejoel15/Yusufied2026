<?php

use App\Http\Controllers\AdminController;
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

// Admin login, limited to 10 tries a minute per IP to slow down password guessing
Route::post('/admin/login', [AdminController::class, 'login'])->middleware('throttle:10,1');

// Admin-only routes: they need a valid login token
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/me', fn () => response()->json(['ok' => true])); // Lets the website check a saved token
    Route::post('/logout', [AdminController::class, 'logout']); // End the session
    Route::delete('/uploads/{upload}', [AdminController::class, 'destroyUpload']); // Delete a photo or video
    Route::delete('/messages/{message}', [AdminController::class, 'destroyMessage']); // Delete a message
});
