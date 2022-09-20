<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event)
    {
        $cutsomer = $event->getControllerResult();
        //On prend la method utiliser
        $method = $event->getRequest()->getMethod();

        if($cutsomer instanceof Customer && $method === "POST"){
            //choper l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            //Assigner l'utilisateur connecter au customer q'on est en train de créer
            $cutsomer->setUser($user);
        }


    }
}   