<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

use App\Models\Cliente;
use App\Models\Movil;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('compras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_user_id')->constrained('clientes', 'user_id');
            
            $table->foreignId('movil_id')->constrained('moviles');
            
            $table->decimal('precio_venta', 10, 2);
            $table->integer('cantidad')->default(1);
            $table->enum('metodo_pago', ['Tarjeta', 'Transferencia', 'Efectivo'])->default('Tarjeta');
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
        Schema::dropIfExists('compras');
    }
};
