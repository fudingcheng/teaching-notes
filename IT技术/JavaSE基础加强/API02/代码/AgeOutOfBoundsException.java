package com.itheima.exce;

/**
 * 自定义的年龄超过范围的异常
 */
public class AgeOutOfBoundsException extends RuntimeException{

    public AgeOutOfBoundsException() {
    }

    public AgeOutOfBoundsException(String message) {
        super(message); //??
    }
}
