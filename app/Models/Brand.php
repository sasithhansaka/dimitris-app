<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $logo
 * @property string $status
 * @property bool $featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'description', 'logo', 'status', 'featured'])]
class Brand extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected $casts = [
        'featured' => 'boolean',
    ];

    public function distributors(): BelongsToMany
    {
        return $this->belongsToMany(Distributor::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
