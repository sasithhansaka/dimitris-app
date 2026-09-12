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
        Schema::table('gift_cards', function (Blueprint $table) {
            $table->boolean('featured')->default(false)->after('status');
            $table->date('start_date')->nullable()->after('featured');
            $table->date('end_date')->nullable()->after('start_date');
        });

        DB::table('gift_cards')->whereNull('start_date')->update([
            'start_date' => now()->toDateString(),
            'end_date' => now()->addYear()->toDateString(),
        ]);

        DB::statement('ALTER TABLE gift_cards MODIFY start_date DATE NOT NULL');
        DB::statement('ALTER TABLE gift_cards MODIFY end_date DATE NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gift_cards', function (Blueprint $table) {
            $table->dropColumn(['featured', 'start_date', 'end_date']);
        });
    }
};
