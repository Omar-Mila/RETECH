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
        Schema::create('modelos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 50);
            $table->foreignId('marca_id')->constrained('marcas')->onDelete('cascade');

            $table->foreignId('sistema_operativo_id')
                  ->constrained('sistemas_operativos')
                  ->onDelete('restrict');
            
            $table->enum('conector', ['Type-C', 'Lightning', 'Micro-USB']);

            //Caracteristicas tecnicas
            $table->string('procesador', 50);
            $table->boolean('cinco_g')->default(false);

            $table->integer('camara_principal_mp');
            $table->integer('camara_frontal_mp');
            $table->integer('bateria_mah');
            $table->decimal('pantalla_pulgadas', 3, 1);
            $table->integer('hz_pantalla');

            //capacidades
            $table->boolean('nfc')->default(false);
            $table->enum('tipo_sim', [
                'SIM',
                'eSIM',
                'Dual SIM',
                'SIM + eSIM'
            ]);

            $table->timestamps();
            
            $table->unique(['marca_id', 'nombre']);

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('modelos');
    }
};
