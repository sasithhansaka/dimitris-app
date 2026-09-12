<?php

namespace App\Models;

use App\Traits\LogsActivity;
use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail as MustVerifyEmailContract;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property Carbon $registered_date
 * @property string $status
 * @property string|null $country
 * @property string|null $city
 * @property string|null $address
 * @property string|null $phone_number
 * @property Carbon|null $dob
 * @property bool $terms_and_conditions
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'registered_date', 'status', 'country', 'city', 'address', 'phone_number', 'dob', 'terms_and_conditions'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmailContract, PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, LogsActivity, MustVerifyEmail, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    public const ROLE_USER = 'user';

    public const ROLE_ADMIN = 'admin';

    public const ROLE_SUPER_ADMIN = 'super_admin';

    public const STATUS_ACTIVE = 'active';

    public const STATUS_INACTIVE = 'inactive';

    public const STATUS_SUSPEND = 'suspend';

    public function isAdmin(): bool
    {
        return in_array($this->role, [self::ROLE_ADMIN, self::ROLE_SUPER_ADMIN], true);
    }

    public function favoriteCategories(): BelongsToMany
    {
        return $this->belongsToMany(ProductCategory::class, 'user_favorite_categories', 'user_id', 'category_id')
            ->using(UserFavoriteCategory::class)
            ->withTimestamps();
    }

    public function favoriteBrands(): BelongsToMany
    {
        return $this->belongsToMany(Brand::class, 'user_favorite_brands', 'user_id', 'brand_id')
            ->using(UserFavoriteBrand::class)
            ->withTimestamps();
    }

    public function favoriteGiftCards(): BelongsToMany
    {
        return $this->belongsToMany(GiftCard::class, 'user_favorite_gift_cards', 'user_id', 'gift_card_id')
            ->using(UserFavoriteGiftCard::class)
            ->withTimestamps();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'registered_date' => 'date',
            'dob' => 'date',
            'terms_and_conditions' => 'boolean',
            /* @chisel-2fa */
            'two_factor_confirmed_at' => 'datetime',
            /* @end-chisel-2fa */
        ];
    }
}
