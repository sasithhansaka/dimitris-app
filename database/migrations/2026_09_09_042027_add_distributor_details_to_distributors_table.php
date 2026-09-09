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
        Schema::table('distributors', function (Blueprint $table) {
            $table->string('distributor_code')->nullable()->unique()->after('id');
            $table->string('legal_company_name')->nullable()->after('name');
            $table->string('tax_id')->nullable()->after('legal_company_name');
            $table->string('website')->nullable()->after('tax_id');
            $table->string('primary_contact')->nullable()->after('website');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('distributors', function (Blueprint $table) {
            $table->dropColumn([
                'distributor_code',
                'legal_company_name',
                'tax_id',
                'website',
                'primary_contact',
            ]);
        });
    }
};
