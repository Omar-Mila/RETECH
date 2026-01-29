<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('empresas', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->primary('user_id');

            $table->string('nombre_empresa', 50);
            $table->char('cif', 9)->unique();
            $table->string('direccion_fiscal', 150);
            $table->string('telefono', 15);
            $table->string('descripcion', 255)->nullable();

            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('empresas');
    }
};
