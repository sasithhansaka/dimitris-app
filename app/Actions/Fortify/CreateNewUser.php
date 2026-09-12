<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'country' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'digits_between:1,50'],
            'dob' => ['required', 'date', 'before_or_equal:-18 years'],
            'terms_and_conditions' => ['required', 'accepted'],
        ], [
            'dob.before_or_equal' => 'You must be at least 18 years old to register.',
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'role' => User::ROLE_USER,
            'country' => $input['country'],
            'city' => $input['city'],
            'address' => $input['address'],
            'phone_number' => $input['phone_number'],
            'dob' => $input['dob'] ?? null,
            'terms_and_conditions' => true,
        ]);
    }
}
