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
        Schema::table('retailers', function (Blueprint $table) {
            $table->string('retailer_code')->nullable()->unique()->after('id');
            $table->string('website')->nullable()->after('logo');
            $table->string('primary_contact')->nullable()->after('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('retailers', function (Blueprint $table) {
            $table->dropColumn(['retailer_code', 'website', 'primary_contact']);
        });
    }
};
