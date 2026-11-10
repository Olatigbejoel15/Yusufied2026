<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    // Fields allowed to be saved in one go
    protected $fillable = ['guest_name', 'body'];
}
