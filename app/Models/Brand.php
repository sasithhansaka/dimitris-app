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
 * @property string $brand_code
 * @property string $name
 * @property string|null $description
 * @property string|null $logo
 * @property string|null $website
 * @property string $status
 * @property bool $featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['brand_code', 'name', 'description', 'logo', 'website', 'status', 'featured'])]
class Brand extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected $casts = [
        'featured' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Brand $brand) {
            if (empty($brand->brand_code)) {
                $brand->brand_code = static::nextBrandCode();
            }
        });
    }

    /**
     * Generate the next sequential brand code (e.g. BR-001).
     */
    public static function nextBrandCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('brand_code')
            ->orderByDesc('id')
            ->value('brand_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'BR-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function distributors(): BelongsToMany
    {
        return $this->belongsToMany(Distributor::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }
}
