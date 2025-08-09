<?php

namespace Optimust\Core\Dao;

use Optimust\Entity\Email;
use Optimust\Entity\EmailTemplate;

class EmailDao extends BaseDao
{
    /**
     * @param string $name
     * @return Email|null
     */
    public function getEmailByName(string $name): ?Email
    {
        return $this->getRepository(Email::class)->findOneBy(['name' => $name]);
    }

    /**
     * Get all matching email templates for the given email
     *
     * fetches templates for given role and records for which role is null.
     *
     * @param string $name Email Name
     * @param string $locale locale
     * @param string|null $recipientRole recipient role
     * @param string|null $performerRole performer role
     * @return EmailTemplate[]
     */
    public function getEmailTemplateMatches(
        string $name,
        string $locale,
        ?string $recipientRole,
        ?string $performerRole
    ): array {
        $q = $this->createQueryBuilder(EmailTemplate::class, 't')
            ->leftJoin('t.email', 'e')
            ->andWhere('e.name = :name')
            ->setParameter('name', $name)
            ->andWhere('t.locale = :locale')
            ->setParameter('locale', $locale);
        if (empty($recipientRole)) {
            $q->andWhere($q->expr()->isNull('t.recipientRole'));
        } else {
            $q->andWhere(
                $q->expr()->orX(
                    $q->expr()->isNull('t.recipientRole'),
                    $q->expr()->eq('t.recipientRole', ':recipientRole'),
                )
            );
            $q->setParameter('recipientRole', $recipientRole);
        }

        if (empty($performerRole)) {
            $q->andWhere($q->expr()->isNull('t.performerRole'));
        } else {
            $q->andWhere(
                $q->expr()->orX(
                    $q->expr()->isNull('t.performerRole'),
                    $q->expr()->eq('t.performerRole', ':performerRole'),
                )
            );
            $q->setParameter('performerRole', $performerRole);
        }
        return $q->getQuery()->execute();
    }
}
