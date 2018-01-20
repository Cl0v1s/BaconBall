/**
 * Created by clovis on 26/08/17.
 */
interface Controller
{
    player : EntityPlayer;

    left() : void ;
    right() : void ;
    up() : void;
    down() : void;
    action() : void;

    cancel() : void;

}