<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UploadController;

Route::get('/uploads', [UploadController::class, 'index']); // Gallery list
Route::post('/uploads', [UploadController::class, 'store']); // Receive uploads


