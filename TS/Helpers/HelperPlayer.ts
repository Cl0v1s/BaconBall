/**
 * Created by clovis on 29/08/17.
 */
class HelperPlayer
{
    public static CheckPlayerTile(map : GameMap, entity : Entity) : void
    {
        if(entity instanceof EntityPlayer == false)
            return;
        let player = <EntityPlayer>entity;
        let x = Math.floor(entity.sprite.x / Config.TileSize);
        let y = Math.floor(entity.sprite.y / Config.TileSize);
        if(map.grid[x][y] == Config.Tiles.Lava)
            player.setOnFire(true);
        else if(map.grid[x][y] == Config.Tiles.Water)
            player.setOnFire(false);
    }
}