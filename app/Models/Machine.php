<?php

namespace App\Models;

use Database\Factories\MachineFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Machine extends Model
{
    /** @use HasFactory<MachineFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'machine_code',
        'machine_name',
        'status',
        'location',
        'last_maintenance',
        'next_maintenance',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'last_maintenance' => 'date',
            'next_maintenance' => 'date',
        ];
    }

    /**
     * Get the production logs for this machine.
     */
    public function productionLogs(): HasMany
    {
        return $this->hasMany(ProductionLog::class);
    }
}
