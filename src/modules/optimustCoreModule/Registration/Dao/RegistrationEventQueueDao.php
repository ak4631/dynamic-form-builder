<?php

namespace Optimust\Core\Registration\Dao;

use Optimust\Core\Dao\BaseDao;
use Optimust\Entity\RegistrationEventQueue;
use Optimust\ORM\ListSorter;

class RegistrationEventQueueDao extends BaseDao
{
    /**
     * @param RegistrationEventQueue $registrationEventQueue
     * @return RegistrationEventQueue
     */
    public function saveRegistrationEvent(RegistrationEventQueue $registrationEventQueue): RegistrationEventQueue
    {
        $this->persist($registrationEventQueue);
        return $registrationEventQueue;
    }

    /**
     * @param $eventType
     * @return RegistrationEventQueue|null
     */
    public function getRegistrationEventByType($eventType): ?RegistrationEventQueue
    {
        $q = $this->createQueryBuilder(RegistrationEventQueue::class, 'registrationEvent');
        $q->where('registrationEvent.eventType = :eventType')
            ->setParameter('eventType', $eventType)
            ->addOrderBy('registrationEvent.id', ListSorter::DESCENDING);

        return $this->fetchOne($q);
    }

    /**
     * @param $limit
     * @return array
     */
    public function getUnpublishedRegistrationEvents($limit): array
    {
        $q = $this->createQueryBuilder(RegistrationEventQueue::class, 'registrationEvent');
        $q->andWhere('registrationEvent.published = :published')
            ->setParameter('published', false);
        $q->setMaxResults($limit);
        return $q->getQuery()->execute();
    }
}
