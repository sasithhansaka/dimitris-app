<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $distributor_code
 * @property string $name
 * @property string|null $legal_company_name
 * @property string $country
 * @property string|null $description
 * @property string|null $logo
 * @property string|null $tax_id
 * @property string|null $website
 * @property string|null $primary_contact
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $address
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['distributor_code', 'name', 'legal_company_name', 'country', 'description', 'logo', 'tax_id', 'website', 'primary_contact', 'email', 'phone', 'address', 'status'])]
class Distributor extends Model
{
    use LogsActivity;

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_DRAFT = 'draft';

    protected static function booted(): void
    {
        static::creating(function (Distributor $distributor) {
            if (empty($distributor->distributor_code)) {
                $distributor->distributor_code = static::nextDistributorCode();
            }
        });
    }

    /**
     * Generate the next sequential distributor code (e.g. DST-001).
     */
    public static function nextDistributorCode(): string
    {
        $lastNumber = static::query()
            ->whereNotNull('distributor_code')
            ->orderByDesc('id')
            ->value('distributor_code');

        $nextNumber = 1;

        if ($lastNumber && preg_match('/(\d+)$/', $lastNumber, $matches)) {
            $nextNumber = ((int) $matches[1]) + 1;
        }

        return 'DST-'.str_pad((string) $nextNumber, 3, '0', STR_PAD_LEFT);
    }

    public function brands(): BelongsToMany
    {
        return $this->belongsToMany(Brand::class);
    }
}
