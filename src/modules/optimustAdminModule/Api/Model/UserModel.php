<?php

namespace Optimust\Admin\Api\Model;

use OpenApi\Annotations as OA;
use Optimust\Core\Api\V1\Serializer\ModelTrait;
use Optimust\Core\Api\V1\Serializer\Normalizable;
use Optimust\Entity\User;

/**
 * @OA\Schema(
 *     schema="Admin-UserModel",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="userName", type="string"),
 *     @OA\Property(property="deleted", type="boolean"),
 *     @OA\Property(property="status", type="boolean"),
 *     @OA\Property(
 *         property="userRole",
 *         type="object",
 *         @OA\Property(property="id", type="integer"),
 *         @OA\Property(property="name", type="string"),
 *         @OA\Property(property="displayName", type="string"),
 *     )
 * )
 */
class UserModel implements Normalizable
{
    use ModelTrait;

    /**
     * @param User $systemUser
     */
    public function __construct(User $systemUser)
    {
        $this->setEntity($systemUser);
        $this->setFilters(
            [
                'id',
                'userName',
                ['isDeleted'],
                'status',
                ['getUserRole', 'getId'],
                ['getUserRole', 'getName'],
                ['getUserRole', 'getDisplayName'],
            ]
        );
        $this->setAttributeNames(
            [
                'id',
                'userName',
                'deleted',
                'status',
                ['userRole', 'id'],
                ['userRole', 'name'],
                ['userRole', 'displayName'],
            ]
        );
    }
}
