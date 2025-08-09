<?php

namespace Optimust\Core\Dao;

use Optimust\Entity\Mail;

class EmailQueueDao extends BaseDao
{
    /**
     * @param int $id
     * @return Mail|null
     */
    public function getEmail(int $id): ?Mail
    {
        return $this->getRepository(Mail::class)->find($id);
    }

    /**
     * @param Mail $mail
     * @return Mail
     */
    public function saveEmail(Mail $mail): Mail
    {
        $this->persist($mail);
        return $mail;
    }

    /**
     * @param int[] $toDeleteIds
     * @return int
     */
    public function removeFromQueue(array $toDeleteIds): int
    {
        $q = $this->createQueryBuilder(Mail::class, 'm');
        $q->delete()
            ->where($q->expr()->in('m.id', ':ids'))
            ->setParameter('ids', $toDeleteIds);
        return $q->getQuery()->execute();
    }

    /**
     * @return int[]
     */
    public function getAllPendingMailIds(): array
    {
        $q = $this->createQueryBuilder(Mail::class, 'm');
        $q->select('m.id')
            ->where('m.status = :status')
            ->setParameter('status', Mail::STATUS_PENDING);
        $result = $q->getQuery()->getArrayResult();
        return array_column($result, 'id');
    }
}
