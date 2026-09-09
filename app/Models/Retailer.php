<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $retailer_code
 * @property string $name
 * @property string|null $description
 * @property string|null $logo
 * @property string|null $website
 * @property string|null $primary_contact
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address
 * @property string $country
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['retailer_code', 'name', 'description', 'logo', 'website', 'primary_contact', 'email', 'phone', 'address', 'country', 'status'])]
class Retailer extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected static function booted(): void
    {
        static::creating(function (Retailer $retailer) {
            if (empty($retailer->retailer_code)) {
                $retailer->retailer_code = static::nextRetailerCode();
            }
        });
    }

    /**
     * Generate the next sequential retailer code (e.g. RET-001).
     */
    public static function nextRetailerCode(): string
    {
        $lastCode = static::query()
            ->whereNotNull('retailer_code')
            ->orderByDesc('id')
            ->value('retailer_code');

        $nextNumber = 1;

        if ($lastCode && preg_match('/(\d+)$/', $lastCode, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'RET-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_retailers');
    }

    public function coupons(): BelongsToMany
    {
        return $this->belongsToMany(Coupon::class, 'coupon_retailers')
            ->withTimestamps();
    }
}
