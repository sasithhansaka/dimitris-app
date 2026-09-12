<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $gift_card_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['user_id', 'gift_card_id'])]
class UserFavoriteGiftCard extends Pivot
{
    public $incrementing = true;

    protected $table = 'user_favorite_gift_cards';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function giftCard(): BelongsTo
    {
        return $this->belongsTo(GiftCard::class);
    }
}
