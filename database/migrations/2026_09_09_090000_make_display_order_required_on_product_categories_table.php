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
        $categories = DB::table('product_categories')
            ->whereNull('display_order')
            ->orderBy('id')
            ->pluck('id');

        $nextOrder = (int) DB::table('product_categories')->max('display_order') + 1;

        foreach ($categories as $id) {
            DB::table('product_categories')->where('id', $id)->update(['display_order' => $nextOrder]);
            $nextOrder++;
        }

        DB::statement('ALTER TABLE product_categories MODIFY display_order INT UNSIGNED NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE product_categories MODIFY display_order INT UNSIGNED NULL');
    }
};
