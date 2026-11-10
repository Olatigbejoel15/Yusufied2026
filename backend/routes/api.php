<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\MessageController;

Route::get('/uploads', [UploadController::class, 'index']); // Gallery list
Route::post('/uploads', [UploadController::class, 'store']); // Receive uploads

Route::get('/messages', [MessageController::class, 'index']); // Message wall list
Route::post('/messages', [MessageController::class, 'store'])->middleware('throttle:60,1'); // Max 60 per minute per IP


