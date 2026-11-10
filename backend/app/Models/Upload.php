<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Upload extends Model
{
    // Fields allowed to be saved in one go
    protected $fillable = ['guest_name', 'path', 'type', 'original_name', 'size'];

    // Adds "url" to every JSON response
    protected $appends = ['url'];

    // Builds the public file address from the stored path
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }
}
