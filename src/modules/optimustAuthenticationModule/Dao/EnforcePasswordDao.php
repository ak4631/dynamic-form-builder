<?php

namespace Optimust\Authentication\Dao;

use Optimust\Core\Dao\BaseDao;
use Optimust\Entity\EnforcePasswordRequest;

class EnforcePasswordDao extends BaseDao
{
    /**
     * @param EnforcePasswordRequest $enforcePasswordRequest
     * @return EnforcePasswordRequest
     */
    public function saveEnforcedPasswordRequest(EnforcePasswordRequest $enforcePasswordRequest): EnforcePasswordRequest
    {
        $this->persist($enforcePasswordRequest);
        return $enforcePasswordRequest;
    }

    /**
     * @param string $resetCode
     * @return EnforcePasswordRequest|null
     */
    public function getEnforcedPasswordLogByResetCode(string $resetCode): ?EnforcePasswordRequest
    {
        $q = $this->createQueryBuilder(EnforcePasswordRequest::class, 'request');
        $q->leftJoin('request.user', 'user');
        $q->andWhere('request.resetCode = :code');
        $q->andWhere('user.deleted = :deleted');
        $q->setParameter('deleted', false);
        $q->setParameter('code', $resetCode);
        return $q->getQuery()->getOneOrNullResult();
    }

    /**
     * @param string $userId
     * @param bool   $expired
     * @return bool
     */
    public function updateEnforcedPasswordValid(string $userId, bool $expired): bool
    {
        $q = $this->createQueryBuilder(EnforcePasswordRequest::class, 'request');
        $q->update()
            ->set('request.expired', ':expired')
            ->setParameter('expired', $expired)
            ->where('request.user = :userId')
            ->setParameter('userId', $userId);
        $result = $q->getQuery()->execute();
        return $result > 0;
    }
}
