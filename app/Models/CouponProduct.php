<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $coupon_id
 * @property int $product_id
 * @property string $ocr_name
 * @property string $ocr_keywords
 * @property int $quantity
 * @property bool $required
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['coupon_id', 'product_id', 'ocr_name', 'ocr_keywords', 'quantity', 'required'])]
class CouponProduct extends Pivot
{
    public $incrementing = true;

    protected $table = 'coupon_products';

    protected $casts = [
        'required' => 'boolean',
    ];

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
