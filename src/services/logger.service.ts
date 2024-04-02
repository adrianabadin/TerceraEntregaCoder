import {createLogger, format, level} from "winston"
import winston from "winston";
import dotenv from 'dotenv';
dotenv.config()

const customLevelOptions={
    levels:{
        fatal:0, 
        error:1, 
        warning:2, 
        info:3, 
        http:4,
        debug:5
    },
    colors:{
        debug:"white",
        info:"blue",
        warning:"yellow",
        error:"magenta",
        http:"green",
        fatal:"red"
    }
}
export const loggerService= createLogger(
    {
        levels:{fatal:0,error:1,warning:2,info:3,http:4,debug:5},
        transports:[

            new winston.transports.File({
                level:"error",
                format:winston.format.simple(),
                filename: "./error.log"
            })
        ]
    }
)
if (process.env.NODE_ENV !== "prod"){
    loggerService.add(new winston.transports.Console({level: "debug",format:winston.format.combine(
        winston.format.colorize({colors:customLevelOptions.colors}),winston.format.simple()
    )}),)
}else {
    loggerService.add(new winston.transports.Console({level: "info",format:winston.format.combine(
        winston.format.colorize({colors:customLevelOptions.colors}),winston.format.simple()
    )}))
}

export default loggerService as winston.Logger & Record<"fatal",({})=>void> &Record<"http",({})=>void>