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
 * @property string $description
 * @property string $image
 * @property string $country
 * @property string $currency
 * @property Carbon $start_date
 * @property Carbon $end_date
 * @property string $status
 * @property bool $featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'description', 'image', 'country', 'currency', 'start_date', 'end_date', 'status', 'featured'])]
class Coupon extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'featured' => 'boolean',
    ];

    public function couponProducts(): HasMany
    {
        return $this->hasMany(CouponProduct::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'coupon_products')
            ->using(CouponProduct::class)
            ->withPivot(['ocr_name', 'ocr_keywords', 'quantity', 'required'])
            ->withTimestamps();
    }

    public function retailers(): BelongsToMany
    {
        return $this->belongsToMany(Retailer::class, 'coupon_retailers')
            ->withTimestamps();
    }
}
