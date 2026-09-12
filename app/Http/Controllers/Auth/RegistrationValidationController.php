<?php

namespace App\Http\Controllers\Auth;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegistrationValidationController extends Controller
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate the account details step of the registration form
     * without creating a user.
     */
    public function account(Request $request): void
    {
        Validator::make($request->all(), [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();
    }
}
