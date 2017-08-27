/**
 * Created by clovis on 27/08/17.
 */
class Config
{
    public static AirDensity : number = 0.3;


    public static TileSize : number = 32;

    public static ObstacleProbability : number = 30; //%
    public static ObstacleLength : number = 3;

    public static Tiles = {
        "Ground" : 0,
        "Wall" : 1,
        "WallH" : 2,
        "WallV" : 3,
    };

    public static TilesWalkable(tile : number)
    {
        switch(tile) {
            default:
                return false;
            case Config.Tiles.Ground:
                return true;
        }
    }
}