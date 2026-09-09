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
        Schema::table('products', function (Blueprint $table) {
            $table->string('pack_size')->nullable()->after('description');
            $table->string('sku')->nullable()->after('pack_size');
            $table->string('barcode')->nullable()->after('sku');
            $table->string('variant')->nullable()->after('barcode');
            $table->string('receipt_aliases')->nullable()->after('variant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['pack_size', 'sku', 'barcode', 'variant', 'receipt_aliases']);
        });
    }
};
