<?php

namespace Optimust\Authentication\Dao;

use Optimust\Core\Dao\BaseDao;
use Optimust\Entity\ResetPasswordRequest;

class ResetPasswordDao extends BaseDao
{
    /**
     * @param ResetPasswordRequest $resetPassword
     * @return ResetPasswordRequest
     */
    public function saveResetPasswordRequest(ResetPasswordRequest $resetPassword): ResetPasswordRequest
    {
        $this->persist($resetPassword);
        return $resetPassword;
    }


    /**
     * @param string $email
     * @return ResetPasswordRequest|null
     */
    public function getResetPasswordLogByEmail(string $email): ?ResetPasswordRequest
    {
        $q = $this->createQueryBuilder(ResetPasswordRequest::class, 'r');
        $q->andWhere('r.resetEmail = :email')
            ->setParameter('email', $email)
            ->orderBy('r.resetRequestDate', 'DESC')
            ->setMaxResults(1);
        return $q->getQuery()->execute()[0];
    }

    /**
     * @param string $resetCode
     * @return ResetPasswordRequest|null
     */
    public function getResetPasswordLogByResetCode(string $resetCode): ?ResetPasswordRequest
    {
        $q = $this->createQueryBuilder(ResetPasswordRequest::class, 'r');
        $q->andWhere('r.resetCode = :code');
        $q->setParameter('code', $resetCode);
        return $q->getQuery()->getOneOrNullResult();
    }

    /**
     * @param string $email
     * @param int $value
     * @return bool
     */
    public function updateResetPasswordValid(string $email, int $value): bool
    {
        $q = $this->createQueryBuilder(ResetPasswordRequest::class, 'r');
        $q->update()
            ->set('r.expired', ':value')
            ->setParameter('value', $value)
            ->andWhere('r.resetEmail = :email')
            ->setParameter('email', $email);
        $result = $q->getQuery()->execute();
        return $result > 0;
    }
}
