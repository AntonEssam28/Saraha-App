class Logger{
    constructor(){
        if(!Logger.instance){
            Logger.instance=this; //{}
        }
        return Logger.instance; //{}
    }

    log(level,message,metaData={}){
        const logObject = {
            level:level, //'log','info''debug',
            message:message,
            ...metaData,
            timeStamp: new Date().toISOString(),
        }
        console.log(JSON.stringify(logObject));
    }

    error(message,metaData={}){
        this.log('error' , message , metaData)
    }
    debug(message,metaData={}){
        this.log('debug' ,message,metaData)
    }
    info(message,metaData={}){
        this.log('info' ,message,metaData)
    }
}

export const logger = new Logger();