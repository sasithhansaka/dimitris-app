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
        Schema::table('users', function (Blueprint $table) {
            $table->string('country')->nullable()->after('status');
            $table->string('city')->nullable()->after('country');
            $table->string('address')->nullable()->after('city');
            $table->string('phone_number')->nullable()->after('address');
            $table->date('dob')->nullable()->after('phone_number');
            $table->boolean('terms_and_conditions')->default(false)->after('dob');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'country',
                'city',
                'address',
                'phone_number',
                'dob',
                'terms_and_conditions',
            ]);
        });
    }
};
