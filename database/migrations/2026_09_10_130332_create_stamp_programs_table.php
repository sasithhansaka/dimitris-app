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
        Schema::create('stamp_programs', function (Blueprint $table) {
            $table->id();
            $table->string('stamp_code')->unique();
            $table->string('name')->unique();
            $table->text('description');
            $table->integer('required_stamps');
            $table->string('image');
            $table->boolean('featured')->default(false);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status')->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stamp_programs');
    }
};
