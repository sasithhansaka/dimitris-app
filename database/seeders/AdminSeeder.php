<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed the application's default super admin users.
     */
    public function run(): void
    {
        $admins = [
            [
                'name' => 'Super Admin',
                'email' => 'superadmin1@gmail.com',
                'password' => 'Super#Admin1st',
            ],
            [
                'name' => 'Super Admin',
                'email' => 'superadmin2@gmail.com',
                'password' => 'Super#Admin2nd',
            ],
        ];

        foreach ($admins as $admin) {
            User::updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => $admin['password'],
                    'role' => User::ROLE_SUPER_ADMIN,
                    'registered_date' => now(),
                    'status' => User::STATUS_ACTIVE,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
