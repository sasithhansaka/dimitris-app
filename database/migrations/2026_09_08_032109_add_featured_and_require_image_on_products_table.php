<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('featured')->default(false)->after('status');
        });

        DB::table('products')->whereNull('image')->update(['image' => '']);

        DB::statement('ALTER TABLE products MODIFY image VARCHAR(255) NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE products MODIFY image VARCHAR(255) NULL');

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('featured');
        });
    }
};
