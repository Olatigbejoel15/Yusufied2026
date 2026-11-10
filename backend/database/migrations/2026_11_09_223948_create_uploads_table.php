<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('uploads', function (Blueprint $table) {
        $table->id(); // Auto-increment primary key
        $table->string('guest_name')->nullable(); // Uploader's name (optional)
        $table->string('path'); // File location inside storage
        $table->string('type'); // "image" or "video"
        $table->string('original_name'); // Filename from the guest's phone
        $table->unsignedBigInteger('size'); // File size in bytes
        $table->timestamps(); // created_at and updated_at
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploads');
    }
};
