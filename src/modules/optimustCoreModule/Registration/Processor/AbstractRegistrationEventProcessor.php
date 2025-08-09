<?php

namespace Optimust\Core\Registration\Processor;

use DateTime;
use Optimust\Admin\Traits\Service\UserServiceTrait;
use Optimust\Config\Config;
use Optimust\Core\Registration\Dao\RegistrationEventQueueDao;
use Optimust\Core\Registration\Helper\SystemConfigurationHelper;
use Optimust\Core\Registration\Service\RegistrationAPIClientService;
use Optimust\Core\Traits\LoggerTrait;
use Optimust\Core\Traits\Service\ConfigServiceTrait;
use Optimust\Core\Traits\Service\DateTimeHelperTrait;
use Optimust\Entity\RegistrationEventQueue;
use Throwable;

abstract class AbstractRegistrationEventProcessor
{
    use LoggerTrait;
    use ConfigServiceTrait;
    use UserServiceTrait;
    use DateTimeHelperTrait;

    private RegistrationEventQueueDao $registrationEventQueueDao;
    private RegistrationAPIClientService $registrationAPIClientService;

    /**
     * @return RegistrationEventQueueDao
     */
    public function getRegistrationEventQueueDao(): RegistrationEventQueueDao
    {
        return $this->registrationEventQueueDao ??= new RegistrationEventQueueDao();
    }

    /**
     * @return RegistrationAPIClientService
     */
    public function getRegistrationAPIClientService(): RegistrationAPIClientService
    {
        return $this->registrationAPIClientService ??= new RegistrationAPIClientService();
    }

    public function saveRegistrationEvent(): void
    {
        if ($this->getEventToBeSavedOrNot()) {
            $registrationEvent = $this->processRegistrationEventToSave($this->getDateTimeHelper()->getNow());
            $this->getRegistrationEventQueueDao()->saveRegistrationEvent($registrationEvent);
        }
    }

    /**
     * @return array
     */
    public function getRegistrationEventGeneralData(): array
    {
        $registrationData = [];
        try {
            $instanceIdentifier = $this->getConfigService()->getInstanceIdentifier();
            $systemDetailsHelper = new SystemConfigurationHelper();
            $systemDetails = $systemDetailsHelper->getSystemDetailsAsJson();
            $organizationEmail = '';
            $adminFirstName = '';
            $adminLastName = '';
            $adminContactNumber = '';
            $username = 'Not Captured';
            $timeZone = date_default_timezone_get();

            return [
                'username' => $username,
                'email' => $organizationEmail,
                'telephone' => $adminContactNumber,
                'admin_first_name' => $adminFirstName,
                'admin_last_name' => $adminLastName,
                'timezone' => $timeZone,
                'instance_identifier' => $instanceIdentifier,
                'system_details' => $systemDetails
            ];
        } catch (Throwable $e) {
            $this->getLogger()->error($e->getMessage());
            $this->getLogger()->error($e->getTraceAsString());
            return $registrationData;
        }
    }

    /**
     * @param DateTime $eventTime
     * @return RegistrationEventQueue
     */
    public function processRegistrationEventToSave(DateTime $eventTime): RegistrationEventQueue
    {
        $registrationData = $this->getEventData();
        $registrationEvent = new RegistrationEventQueue();
        $registrationEvent->setEventTime($eventTime);
        $registrationEvent->setEventType($this->getEventType());
        $registrationEvent->setPublished(false);
        $registrationEvent->setData($registrationData);
        return $registrationEvent;
    }

    public function publishRegistrationEvents(): void
    {
        if (Config::PRODUCT_MODE === Config::MODE_PROD) {
            $eventsToPublish = $this->getRegistrationEventQueueDao()
                ->getUnpublishedRegistrationEvents(RegistrationEventQueue::PUBLISH_EVENT_BATCH_SIZE);
            if ($eventsToPublish) {
                foreach ($eventsToPublish as $event) {
                    $postData = $this->getRegistrationEventPublishDataPrepared($event);
                    $result = $this->getRegistrationAPIClientService()->publishData($postData);
                    if ($result) {
                        $event->setPublished(true);
                        $event->setPublishTime(new DateTime());
                        $this->getRegistrationEventQueueDao()->saveRegistrationEvent($event);
                    }
                }
            }
        }
    }

    /**
     * @param RegistrationEventQueue $event
     * @return array
     */
    public function getRegistrationEventPublishDataPrepared(RegistrationEventQueue $event): array
    {
        $eventData = $event->getData();
        $eventData['type'] = $event->getEventType();
        $eventData['event_time'] = $event->getEventTime();
        return $eventData;
    }

    /**
     * @return int
     */
    abstract public function getEventType(): int;

    /**
     * @return array
     */
    abstract public function getEventData(): array;

    /**
     * @return bool
     */
    abstract public function getEventToBeSavedOrNot(): bool;
}
