<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*'], // Apply CORS only to API URLs

    'allowed_methods' => ['*'], // Allow GET, POST, DELETE, etc.

    'allowed_origins' => ['http://localhost:3000'], // Only our Next.js site may call us

    'allowed_headers' => ['*'], // Allow any request headers

    'allowed_origins_patterns' => [],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
