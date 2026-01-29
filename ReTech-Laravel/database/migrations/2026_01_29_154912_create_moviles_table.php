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
        Schema::create('moviles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('modelo_id')
                  ->constrained('modelos')
                  ->onDelete('cascade');

                        
            $table->decimal('precio', 8, 2);
            $table->integer('stock');

            $table->enum('estado', [
                'Como nuevo',
                'Buen estado',
                'Funcional'
            ]);

            $table->integer('salud_bateria');            
            $table->integer('almacenamiento');
            $table->integer('ram');             
            $table->foreignId('color_id')
                  ->constrained('colores')
                  ->onDelete('restrict');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('moviles');
    }
};
