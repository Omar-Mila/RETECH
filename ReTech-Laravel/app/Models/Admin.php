<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;
    protected $table = 'admins';

    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'int';

    public $timestamps = false;


    public function user(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
