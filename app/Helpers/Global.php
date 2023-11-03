<?php

function redirectToProtectedRoute()
{
    $response = Http::withToken(Cookie::get('token'))
        ->get(env('API_BACKEND') . '/api/user-profile');

    if ($response->ok()) {
        return redirect()->route('posts.index');
    } else {
        return view('login');
    }
}
