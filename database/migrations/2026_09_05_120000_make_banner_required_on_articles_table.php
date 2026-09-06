<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('articles')->whereNull('banner')->update(['banner' => '']);

        DB::statement('ALTER TABLE articles MODIFY banner VARCHAR(255) NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE articles MODIFY banner VARCHAR(255) NULL');
    }
};
