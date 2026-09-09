<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $product_code
 * @property int $brand_id
 * @property int $category_id
 * @property string $name
 * @property string $description
 * @property string|null $pack_size
 * @property string|null $sku
 * @property string|null $barcode
 * @property string|null $variant
 * @property string|null $receipt_aliases
 * @property string $image
 * @property string $status
 * @property bool $featured
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['product_code', 'brand_id', 'category_id', 'name', 'description', 'pack_size', 'sku', 'barcode', 'variant', 'receipt_aliases', 'image', 'status', 'featured'])]
class Product extends Model
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
        static::creating(function (Product $product) {
            if (empty($product->product_code)) {
                $product->product_code = static::nextProductCode();
            }
        });
    }

    /**
     * Generate the next sequential product code (e.g. PR-001).
     */
    public static function nextProductCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('product_code')
            ->orderByDesc('id')
            ->value('product_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'PR-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function retailers(): BelongsToMany
    {
        return $this->belongsToMany(Retailer::class, 'product_retailers');
    }

    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(Coupon::class, 'coupon_products')
            ->using(CouponProduct::class)
            ->withPivot(['ocr_name', 'ocr_keywords', 'quantity', 'required'])
            ->withTimestamps();
    }
}
