<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class CreateAdmin extends Command
{
    protected $signature = 'admin:create {email} {password}'; // Usage: php artisan admin:create email password
    protected $description = 'Create the admin account, or reset its password'; // Shown in php artisan list

    public function handle(): int
    {
        User::updateOrCreate(
            ['email' => $this->argument('email')], // Find the account by email
            ['name' => 'Admin', 'password' => $this->argument('password')] // The User model hashes the password
        );

        $this->info('Admin saved.'); // Confirmation message
        return self::SUCCESS; // Exit code 0 means success
    }
}