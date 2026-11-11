<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAccessCode
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = $this->clean(config('wedding.access_code')); // Real code from .env
        $given = $this->clean($request->header('X-Access-Code')); // Code sent by the website

        if ($expected === '' || ! hash_equals($expected, $given)) { // Block if no code is set or it differs
            return response()->json(['message' => 'Invalid access code.'], 403); // 403 means not allowed
        }

        return $next($request); // Code is right, continue to the controller
    }

    // Uppercases and removes spaces, so "yusufied 2026" matches "YUSUFIED2026"
    private function clean(?string $code): string
    {
        return strtoupper(preg_replace('/\s+/', '', (string) $code));
    }
}
